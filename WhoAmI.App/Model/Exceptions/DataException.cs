using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WhoAmI.App.Model.Exceptions
{
    public class DataException : Exception
    {
        public DataException(string message) : base(message) { }
        public DataException(string message, Exception innerException) : base(message, innerException) { }
    }
}
