using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChoreApp.Models
{
    public enum Day { Sunday = 1, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday };
    public class AssignmentSummary
    {
        public AssignmentSummary(int choreId, int childId, string description, Day day, bool completed, bool overdue)
        {
            ChoreId = choreId;
            ChildId = childId;
            Description = description;
            Day = day;
            Completed = completed;
            Overdue = overdue;
        }
        public AssignmentSummary Clone()
        {
            return (AssignmentSummary)this.MemberwiseClone();
        }
        public int ChoreId { get; private set;  }
        public int ChildId { get; private set; }
        public String Description { get; private set; }
        public String DayFormatted
        {
            get
            {
                return Day.ToString();
            }
        }
        public Day Day { get; private set; }
        public bool Completed { get; private set; }
        public bool Overdue { get; private set; }
    }
}