using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WhoAmI.App.Model.Data;
using WhoAmI.App.Model.Exceptions;

namespace WhoAmI.App.Model
{
    public class LobbyRepository
    {
        public List<Lobby> _lobbies;

        public LobbyRepository()
        {
            _lobbies = new List<Lobby>();
        }

        public Lobby CreateNewLobby(Player owner, LobbySetting lobbySettings)
        {
            var lobby = new Lobby
            {
                Id = Guid.NewGuid(),
                Owner = owner,
                Settings = lobbySettings,
                Players = new List<Player>()
            };
            if (owner != null) {
                lobby.Players.Add(owner);
            }
            _lobbies.Add(lobby);
            return lobby;
        }

        public Lobby GetLobby(Guid LobbyId)
        {
            var lobby = _lobbies.SingleOrDefault(x => x.Id.Equals(LobbyId));
            if (lobby == default(Lobby))
                throw new EntryNotFoundException("LobbyId not found");
            return lobby;
        }

        public Lobby JoinLobby(Player user, Guid LobbyId)
        {
            var lobby = _lobbies.SingleOrDefault(x => x.Id.Equals(LobbyId));
            if (lobby == default(Lobby))
                throw new EntryNotFoundException("LobbyId not found");
            if (lobby.Players.Count >= lobby.Settings.MaxUserCount)
                throw new LobbyIsFullException("Lobby is already full");

            if (lobby.Owner == null || lobby.Players.Count <= 0)
            {
                lobby.Owner = user;
            }
            lobby.Players.Add(user);
            
            return lobby;
        }
    }
}
