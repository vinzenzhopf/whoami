using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using WhoAmI.App.Controllers.Base;
using WhoAmI.App.Model;
using WhoAmI.App.Model.Data;
using WhoAmI.App.Model.Exceptions;
using WhoAmI.App.Model.Repositories;

namespace WhoAmI.App.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [LobbyExceptionFilter]
    public class LobbyController : AbstractEndpoint
    {
        public LobbyRepository LobbyRepository { get; }
        public PlayerRepository PlayerRepository { get; }

        public LobbyController(LobbyRepository lobbyRepository, PlayerRepository playerRepository)
        {
            LobbyRepository = lobbyRepository;
            PlayerRepository = playerRepository;
        }

        [HttpPut]
        public ActionResult<Lobby> Put([FromBody] PutLobbyRequestBody body)
        {
            if (body == null)
            {
                return FormattedBadRequest("No Body received!");
            }
            if (!Guid.TryParse(body?.PlayerId, out var guid))
            {
                return FormattedBadRequest("Invalid Player ID");
            }
            var player = PlayerRepository.GetPlayer(guid);
            return LobbyRepository.CreateNewLobby(player, body.LobbySettings);
        }

        [HttpGet]
        public ActionResult<Lobby> Get([FromRoute] string id)
        {
            if (!Guid.TryParse(id, out var guid))
            {
                return FormattedBadRequest("Invalid Player ID");
            }
            else
            {
                return LobbyRepository.GetLobby(guid);
            }
        }

        [HttpPost]
        [Route("join")]
        public ActionResult<Lobby> Join([FromBody] JoinLobbyRequestBody body)
        {
            if (body == null)
            {
                return FormattedBadRequest("No Body received!");
            }
            if (!Guid.TryParse(body.PlayerId, out var playerId))
            {
                return FormattedBadRequest("Invalid Player ID");
            }
            if (!Guid.TryParse(body.LobbyId, out var lobbyId))
            {
                return FormattedBadRequest("Invalid Lobby ID");
            }
            var player = PlayerRepository.GetPlayer(playerId);
            return LobbyRepository.JoinLobby(player, lobbyId);
        }
    }

    public class PutLobbyRequestBody
    {
        public string PlayerId { get; set; }
        public LobbySetting LobbySettings { get; set; }
    }

    public class JoinLobbyRequestBody
    {
        public string PlayerId { get; set; }
        public string LobbyId { get; set; }
    }

    public class PlayerSolvedRequestBody
    {
        public string PlayerId { get; set; }
        public string LobbyId { get; set; }
    }

    public class LobbyExceptionFilterAttribute : WhoAmIExceptionFilterAttribute
    {
        public LobbyExceptionFilterAttribute()
        {
            RegisterException<EntryNotFoundException>(HttpStatusCode.NotFound);
            RegisterException<LobbyIsFullException>(HttpStatusCode.Conflict);
        }
    }
}
