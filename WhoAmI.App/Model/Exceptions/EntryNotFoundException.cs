using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WhoAmI.App.Model.Exceptions
{
    public class EntryNotFoundException : DataException
    {
        public EntryNotFoundException(string message) : base(message) { }
        public EntryNotFoundException(string message, Exception innerException) : base(message, innerException) { }
    }
}
