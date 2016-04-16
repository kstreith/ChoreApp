using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChoreApp.Models
{
    public class Chore
    {
        public int Id { get; set; }
        public String ChildName { get; set; }
        public int ChildId { get; set; }
        public String Description { get; set; }
        public String AssignedDaysFormatted { get; set; }
    }
}