using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Threading.Tasks;

namespace WhoAmI.App.Controllers.Base
{
    public abstract class AbstractEndpoint : ControllerBase
    {
        public object ResourceUriType { get; private set; }

        // 200
        protected JsonResult FormattedOk(string resultMessage = "OK", bool setCacheControlHeadersToNoCache = true)
        {
            Response.StatusCode = StatusCodes.Status200OK;

            // Cache-Control
            if (setCacheControlHeadersToNoCache)
            {
                SetCacheControlHeadersToNoCache();
            }
            else
            {
                RemoveCacheControlHeaders();
            }

            return Json(new
            {
                Result = resultMessage,
                Error = ""
            });
        }


        // 201
        protected JsonResult FormattedCreated<T>(T obj = null) where T : class
        {
            if (obj == null)
            {
                return FormattedCreated("Created");
            }

            Response.StatusCode = StatusCodes.Status201Created;
            RemoveCacheControlHeaders();
            return Json(new
            {
                Result = obj,
                Error = ""
            });
        }

        private JsonResult Json(object p)
        {
            throw new NotImplementedException();
        }

        protected JsonResult FormattedCreated()
        {
            return FormattedCreated("Created");
        }


        // 304
        protected IActionResult FormattedNotModified()
        {
            Response.StatusCode = StatusCodes.Status304NotModified;
            RemoveCacheControlHeaders();

            return new EmptyResult();
        }


        // 400
        protected JsonResult FormattedBadRequest(string errorMessage = "Bad Request")
        {
            Response.StatusCode = StatusCodes.Status400BadRequest;
            SetCacheControlHeadersToNoCache();
            return Json(new
            {
                Result = "",
                Error = errorMessage
            });
        }


        // 401
        protected JsonResult FormattedUnauthorized(string errorMessage = "Unauthorized")
        {
            Response.StatusCode = StatusCodes.Status401Unauthorized;
            RemoveCacheControlHeaders();
            return Json(new
            {
                Result = "",
                Error = errorMessage
            });
        }


        // 404
        protected JsonResult FormattedNotFound(string errorMessage = "Not Found")
        {
            Response.StatusCode = StatusCodes.Status404NotFound;
            SetCacheControlHeadersToNoCache();
            return Json(new
            {
                Result = "",
                Error = errorMessage
            });
        }


        // 422
        protected JsonResult FormattedUnprocessableEntity(string errorMessage = "Unprocessable Entity")
        {
            Response.StatusCode = StatusCodes.Status422UnprocessableEntity;
            SetCacheControlHeadersToNoCache();
            return Json(new
            {
                Result = "",
                Error = errorMessage
            });
        }


        // 500
        protected JsonResult FormattedInternalServerError(string errorMessage = "Internal Server Error")
        {
            Response.StatusCode = StatusCodes.Status500InternalServerError;
            RemoveCacheControlHeaders();
            return Json(new
            {
                Result = "",
                Error = errorMessage
            });
        }


        // 503
        protected JsonResult FormattedServiceUnavailable(string errorMessage = "Service Unavailable")
        {
            Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
            RemoveCacheControlHeaders();
            return Json(new
            {
                Result = "",
                Error = errorMessage
            });
        }


        // Helper Functions
        protected bool CompareETag(string eTag)
        {
            if (!Request.Headers.Keys.Contains("If-None-Match"))
            {
                return false;
            }

            var header = Request.Headers["If-None-Match"].ToString();
            return header == eTag;
        }

        protected void AddETagHeader(string eTag)
        {
            Response.Headers.Add("ETag", new[] { eTag });
        }


        protected bool CompareNotModified(DateTimeOffset lastModified)
        {
            if (Request.Headers.Keys.Contains("If-Modified-Since"))
            {
                var ifNotModifiedSinceRaw = Request.Headers["If-Modified-Since"].ToString();
                if (DateTimeOffset.TryParseExact(ifNotModifiedSinceRaw, "R", CultureInfo.InvariantCulture,
                    DateTimeStyles.AdjustToUniversal, out DateTimeOffset ifNotModifiedSince))
                {
                    return DateTimeOffset.Compare(lastModified, ifNotModifiedSince) < 1;
                }
            }

            return false;
        }


        protected void AddLastModifiedHeader(DateTimeOffset lastModified)
        {
            Response.Headers.Add("Last-Modified", new[] { lastModified.ToString("R") });
        }


        protected void SetCacheControlHeadersToNoCache()
        {
            Response.Headers.Add(new KeyValuePair<string, StringValues>("Cache-Control", "no-cache"));
            Response.Headers.Add(new KeyValuePair<string, StringValues>("Pragma", "no cache"));
            Response.Headers.Add(new KeyValuePair<string, StringValues>("Expires", "0"));
        }


        protected void RemoveCacheControlHeaders()
        {
            if (Response.Headers.ContainsKey("Cache-Control"))
            {
                Response.Headers.Remove("Cache-Control");
            }

            if (Response.Headers.ContainsKey("Pragma"))
            {
                Response.Headers.Remove("Pragma");
            }

            if (Response.Headers.ContainsKey("Expires"))
            {
                Response.Headers.Remove("Expires");
            }
        }

        protected async Task<string> CreatePaginationResourceUriAsync(int pageNumber, int pageSize, ResourceUriType type)
        {
            var queryCollection = Request.Query;
            var filteredQueryCollection = queryCollection
                .Where(x => !x.Key.Equals(nameof(pageNumber), StringComparison.OrdinalIgnoreCase) &&
                            !x.Key.Equals(nameof(pageSize), StringComparison.OrdinalIgnoreCase))
                .ToDictionary<KeyValuePair<string, StringValues>, string, string>(query => query.Key, query => query.Value);

            filteredQueryCollection.Add(nameof(pageSize), pageSize.ToString());
            switch (type)
            {
                case Base.ResourceUriType.PreviousPage:
                    filteredQueryCollection.Add(nameof(pageNumber), (pageNumber - 1).ToString());
                    break;
                case Base.ResourceUriType.NextPage:
                    filteredQueryCollection.Add(nameof(pageNumber), (pageNumber + 1).ToString());
                    break;
                default:
                    filteredQueryCollection.Add(nameof(pageNumber), pageNumber.ToString());
                    break;
            }

            return await QuerifyContentAsync(filteredQueryCollection);
        }


        protected async Task<string> QuerifyContentAsync(object content)
        {
            var keyValueContent = content as IDictionary<string, string> ?? ObjectToStringDictionary(content);
            var queryString = await new FormUrlEncodedContent(keyValueContent).ReadAsStringAsync();
            return $"{Request.Scheme}://{Request.Host.Value}{Request.Path}?{queryString}";
        }


        private static IDictionary<string, string> ObjectToStringDictionary(object obj)
        {
            while (true)
            {
                if (obj == null)
                {
                    return null;
                }

                var token = obj as JToken;
                if (token == null)
                {
                    obj = JObject.FromObject(obj);
                    continue;
                }

                if (token.HasValues)
                {
                    var contentData = new Dictionary<string, string>();
                    return token.Children()
                        .ToList()
                        .Select(ObjectToStringDictionary)
                        .Where(childContent => childContent != null)
                        .Aggregate(contentData, (current, childContent) => current.Concat(childContent)
                            .ToDictionary(k => k.Key, v => v.Value));
                }

                var jValue = token as JValue;
                if (jValue?.Value == null)
                {
                    return null;
                }

                var value = jValue.Type == JTokenType.Date
                    ? jValue.ToString("o", CultureInfo.InvariantCulture)
                    : jValue.ToString(CultureInfo.InvariantCulture);

                return new Dictionary<string, string> { { token.Path, value } };
            }
        }



        /// <summary>
        /// Transforms a single object into the desired projection.
        /// </summary>
        /// <typeparam name="TSource">The type of the source.</typeparam>
        /// <param name="source">The source.</param>
        /// <param name="fields">The fields to be included in the result object.</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException">source</exception>
        /// <exception cref="Exception"></exception>
        protected ExpandoObject TransformSingle<TSource>(TSource source, string fields)
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            var tansformedObject = new ExpandoObject();

            if (string.IsNullOrWhiteSpace(fields))
            {
                var propertyInfos = typeof(TSource)
                    .GetProperties(BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

                foreach (var propertyInfo in propertyInfos)
                {
                    var propertyValue = propertyInfo.GetValue(source);
                    ((IDictionary<string, object>)tansformedObject).Add(propertyInfo.Name, propertyValue);
                }

                return tansformedObject;
            }

            var fieldsAfterSplit = fields.Split(',').Distinct();
            foreach (var field in fieldsAfterSplit)
            {
                var propertyName = field.Trim();
                var propertyInfo = typeof(TSource)
                    .GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

                if (propertyInfo == null)
                {
                    throw new Exception($"Property {propertyName} wasn't found on {typeof(TSource)}");
                }

                var propertyValue = propertyInfo.GetValue(source);
                ((IDictionary<string, object>)tansformedObject).Add(propertyInfo.Name, propertyValue);
            }

            return tansformedObject;
        }


        /// <summary>
        /// Transforms an enumerable of objects into the desired projection.
        /// </summary>
        /// <typeparam name="TSource">The type of the source.</typeparam>
        /// <param name="source">The source.</param>
        /// <param name="fields">The fields to be included in the result object.</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException">source</exception>
        /// <exception cref="Exception"></exception>
        protected IEnumerable<ExpandoObject> TransformMany<TSource>(IEnumerable<TSource> source, string fields)
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            var expandoObjectList = new List<ExpandoObject>();
            var propertyInfoList = new List<PropertyInfo>();

            if (string.IsNullOrWhiteSpace(fields))
            {
                var propertyInfos = typeof(TSource)
                    .GetProperties(BindingFlags.Public | BindingFlags.Instance);

                propertyInfoList.AddRange(propertyInfos);
            }
            else
            {
                var fieldsAfterSplit = fields.Split(',').Distinct();
                foreach (var field in fieldsAfterSplit)
                {
                    var propertyName = field.Trim();
                    var propertyInfo = typeof(TSource)
                        .GetProperty(propertyName,
                            BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

                    if (propertyInfo == null)
                    {
                        throw new Exception($"Property {propertyName} wasn't found on {typeof(TSource)}");
                    }

                    propertyInfoList.Add(propertyInfo);
                }
            }

            foreach (var sourceObject in source)
            {
                var transformedObject = new ExpandoObject();
                foreach (var propertyInfo in propertyInfoList)
                {
                    var propertyValue = propertyInfo.GetValue(sourceObject);
                    ((IDictionary<string, object>)transformedObject).Add(propertyInfo.Name, propertyValue);
                }

                expandoObjectList.Add(transformedObject);
            }

            return expandoObjectList;
        }


        /// <summary>
        /// Checks if the properties for a given type exist.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="fields">The fields.</param>
        /// <returns></returns>
        protected bool TypeHasProperties<T>(string fields)
        {
            if (string.IsNullOrWhiteSpace(fields))
            {
                return true;
            }

            var fieldsAfterSplit = fields.Split(',').Distinct();
            return fieldsAfterSplit.Select(field => field.Trim())
                .Select(propertyName => typeof(T).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance))
                .All(propertyInfo => propertyInfo != null);
        }


        /// <summary>
        /// Gets the ETag string from the given Request Header
        /// </summary>
        /// <param name="request">The HttpRequestMessage</param>
        /// <returns>The ETag from the RequestMessage or null if none is set.</returns>
        private static string GetETag(HttpRequestMessage request)
        {
            // ReSharper disable once ConvertIfStatementToReturnStatement
            if (request.Headers.TryGetValues("If-None-Match", out var values))
            {
                return new EntityTagHeaderValue(values.FirstOrDefault()).Tag;
            }

            return null;
        }
    }

    public enum ResourceUriType
    {
        PreviousPage,
        NextPage,
        Current
    }

}
