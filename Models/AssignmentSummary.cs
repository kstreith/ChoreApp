using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChoreApp.Models
{
    public class AssignmentSummary
    {
        public int ChoreId { get; set; }
        public int ChildId { get; set; }
        public String Description { get; set; }
        public String DayFormatted { get; set; }
        public bool Completed { get; set; }
        public bool Overdue { get; set; }
    }
}