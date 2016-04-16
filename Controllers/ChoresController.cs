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
        private ChoreRepository Repo;

        public ChoresController()
        {
            Repo = ChoreRepository.GetInstance();
        }

        // GET api/users
        public IEnumerable<Chore> Get()
        {
            return Repo.GetAllChores();
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
