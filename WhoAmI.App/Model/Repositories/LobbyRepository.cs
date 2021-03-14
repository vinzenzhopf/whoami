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
        public List<Lobby> lobbies;

        public Lobby CreateNewLobby(Player owner, LobbySetting lobbySettings)
        {
            var lobby = new Lobby
            {
                Id = Guid.NewGuid(),
                Owner = owner,
                Settings = lobbySettings,
                Users = new List<Player>()
            };
            lobby.Users.Add(owner);
            lobbies.Add(lobby);
            return lobby;
        }

        public Lobby GetLobby(Guid LobbyId)
        {
            var lobby = lobbies.SingleOrDefault(x => x.Id.Equals(LobbyId));
            if (lobby == default(Lobby))
                throw new EntryNotFoundException("LobbyId not found");
            return lobby;
        }

        public Lobby JoinLobby(Player user, Guid LobbyId)
        {
            var lobby = lobbies.SingleOrDefault(x => x.Id.Equals(LobbyId));
            if (lobby == default(Lobby))
                throw new EntryNotFoundException("LobbyId not found");
            if (lobby.Users.Count >= lobby.Settings.MaxUserCount)
                throw new LobbyIsFullException("Lobby is already full");
            lobby.Users.Add(user);
            return lobby;
        }
    }
}
