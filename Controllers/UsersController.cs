using ChoreApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ChoreApp.Controllers
{
    public class UsersController : ApiController
    {
        // GET api/users
        public IEnumerable<User> Get()
        {
            var list = new List<User>();
            list.Add(new User { Id = 1, Name = "John" });
            list.Add(new User { Id = 2, Name = "Mary" });
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