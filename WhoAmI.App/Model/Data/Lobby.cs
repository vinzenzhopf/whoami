using System;
using System.Collections.Generic;

namespace WhoAmI.App.Model.Data
{
    public class Lobby
    {
        public Guid Id { get; set; }
        public Player Owner { get; set; }
        public IList<Player> Users { get; set; }
        public LobbySetting Settings { get; set; }
        public Player ActivePlayer { get; set; }
    }
}
