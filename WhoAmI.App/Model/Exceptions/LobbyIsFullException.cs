using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WhoAmI.App.Model.Exceptions
{
    public class LobbyIsFullException : DataException
    {
        public LobbyIsFullException(string message) : base(message) { }
        public LobbyIsFullException(string message, Exception innerException) : base(message, innerException) { }
    }
}
