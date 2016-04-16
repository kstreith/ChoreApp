using ChoreApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ChoreApp.Controllers
{
    public class ChoresController : ApiController
    {
        // GET api/users
        public IEnumerable<Chore> Get()
        {
            var list = new List<Chore>();
            list.Add(new Chore { Id = 1, ChildName = "John", ChildId = 1, Description = "Do Dishes", AssignedDaysFormatted = "M W F Sa" });
            list.Add(new Chore { Id = 2, ChildName = "John", ChildId = 1, Description = "Take Out Trash", AssignedDaysFormatted = "W"});
            return list;
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}
