using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using WhoAmI.App.Controllers.Base;
using WhoAmI.App.Model.Data;
using WhoAmI.App.Model.Exceptions;
using WhoAmI.App.Model.Repositories;

namespace WhoAmI.App.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [PlayerExceptionFilter]
    public class PlayerController : AbstractEndpoint
    {
        public PlayerRepository PlayerRepository { get; }

        public PlayerController(PlayerRepository playerRepository)
        {
            PlayerRepository = playerRepository;
        }

        [HttpPut]
        public ActionResult<Player> Put([FromBody] PutPlayerRequestBody body)
        {
            if(body == null || body?.Image == null || !(body?.Image.HasValue ?? false))
            {
                return FormattedBadRequest("Invalid Request.");
            }
            var player = PlayerRepository.CreatePlayer(body.Name, body.Image.Value);
            return player;
        }

        [HttpGet]
        public ActionResult<Player> Get([FromRoute] string id)
        {
            if (!Guid.TryParse(id, out var guid))
            {
                return FormattedBadRequest("Invalid PlayerId");
            }
            else
            {
                return PlayerRepository.GetPlayer(guid);
            }
        }
    }

    public class PutPlayerRequestBody
    {
        public string Name { get; set; }
        public int? Image { get; set; }
    }

    public class PlayerExceptionFilterAttribute : WhoAmIExceptionFilterAttribute
    {
        public PlayerExceptionFilterAttribute()
        {
            RegisterException<EntryNotFoundException>(HttpStatusCode.NotFound);
            RegisterException<LobbyIsFullException>(HttpStatusCode.Conflict);
        }
    }
}
