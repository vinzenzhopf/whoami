using log4net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;

namespace WhoAmI.App.Controllers
{
    public class WhoAmIExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private static readonly ILog Logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        private readonly IDictionary<Type, HttpStatusCode> _httpStatusCodeByType = new Dictionary<Type, HttpStatusCode>();

        protected WhoAmIExceptionFilterAttribute()
        {
            // Register exceptions
            RegisterException<NotImplementedException>(HttpStatusCode.NotImplemented);
            RegisterException<OutOfMemoryException>(HttpStatusCode.InternalServerError);
            RegisterException<UnauthorizedAccessException>(HttpStatusCode.Unauthorized);
            RegisterException<KeyNotFoundException>(HttpStatusCode.NotFound);
        }

        public override void OnException(ExceptionContext context)
        {
            var exception = context.Exception;
            if (_httpStatusCodeByType.ContainsKey(exception.GetType()))
            {
                context.HttpContext.Response.StatusCode = (int)_httpStatusCodeByType[exception.GetType()];
                context.Result = new JsonResult(exception.Message);
                context.ExceptionHandled = true;
            }
            else
            {
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Result = new JsonResult(exception.Message);
            }
            Logger.Error(exception.Message);
        }

        protected void RegisterException<T>(HttpStatusCode httpStatusCode) where T : Exception
        {
            _httpStatusCodeByType[typeof(T)] = httpStatusCode;
        }
    }

}
