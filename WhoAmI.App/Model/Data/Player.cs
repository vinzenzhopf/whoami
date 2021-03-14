using System;
using System.Linq;
using System.Threading.Tasks;

namespace WhoAmI.App.Model.Data
{
    public class Player
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string CharacterName { get; set; }
        public int GuessedCharacterCount { get; set; }
        public int Icon { get; set; }
        public bool HasSolved { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
    }
}
