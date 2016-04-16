﻿using ChoreApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ChoreApp.Controllers
{
    public class ThisWeekController : ApiController
    {
        private ChoreRepository Repo;

        public ThisWeekController()
        {
            Repo = new ChoreRepository();
        }

        // GET api/<controller>
        public IEnumerable<AssignmentSummary> Get(int id)
        {
            return Repo.GetChildAssignmentsThisWeek(id);
        }

        /*// GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }*/

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