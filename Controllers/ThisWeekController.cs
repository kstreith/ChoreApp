using ChoreApp.Models;
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
        // GET api/<controller>
        public IEnumerable<AssignmentSummary> Get(int id)
        {
            var list = new List<AssignmentSummary>();
            if (id == 1)
            {
                list.Add(new AssignmentSummary { ChoreId = 1, ChildId = 1, Description = "Do Dishes", DayFormatted = "Monday", Completed = true, Overdue = false });
                list.Add(new AssignmentSummary { ChoreId = 2, ChildId = 1, Description = "Take Out Trash", DayFormatted = "Monday", Completed = false, Overdue = true });
            }
            return list;
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