using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WhoAmI.App.Model.Data;
using WhoAmI.App.Model.Exceptions;

namespace WhoAmI.App.Model.Repositories
{
    public class PlayerRepository
    {
        private IDictionary<Guid, Player> Players { get; set; }


        public PlayerRepository()
        {
            Players = new Dictionary<Guid, Player>();
        }

        public Player CreatePlayer(string name, int image)
        {
            var player = new Player
            {
                Id = Guid.NewGuid(),
                Name = name,
                HasSolved = false,
                GuessedCharacterCount = 0,
                CharacterName = "",
                Icon = image,
                UpdatedAt = DateTimeOffset.Now,
                CreatedAt = DateTimeOffset.Now
            };
            Players.Add(player.Id, player);
            return player;
        }

        public Player GetPlayer(Guid guid)
        {
            if (!Players.ContainsKey(guid)){
                throw new EntryNotFoundException("Player not found!");
            }
            var player = Players[guid];
            return player;            
        }
    }
}
