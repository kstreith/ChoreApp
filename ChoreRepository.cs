using ChoreApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChoreApp
{
    public class ChoreRepository
    {
        private Dictionary<int, User> Users { get; set; }
        private Dictionary<int, Chore> Chores { get; set; }

        public ChoreRepository()
        {
            Initialize();
        }

        public List<User> GetAllUsers()
        {
            return Users.Values.OrderBy(x => x.Id).ToList();
        }

        public List<Chore> GetAllChores()
        {
            return Chores.Values.Select(x => x.SetUser(Users[x.ChildId])).OrderBy(x => x.ChildId).ToList();
        }

        public List<AssignmentSummary> GetChildAssignmentsThisWeek(int childId)
        {
            var assignments = new List<AssignmentSummary>();
            var childChores = GetAllChores().Where(x => x.ChildId == childId);
            foreach(var chore in childChores)
            {
                if (chore.OnSunday)
                {
                    assignments.Add(new AssignmentSummary(chore.Id, childId, chore.Description, Day.Sunday, false, false));
                }
                if (chore.OnMonday)
                {
                    assignments.Add(new AssignmentSummary(chore.Id, childId, chore.Description, Day.Monday, false, false));
                }
                if (chore.OnTuesday)
                {
                    assignments.Add(new AssignmentSummary(chore.Id, childId, chore.Description, Day.Tuesday, false, false));
                }
                if (chore.OnWednesday)
                {
                    assignments.Add(new AssignmentSummary(chore.Id, childId, chore.Description, Day.Wednesday, false, false));
                }
                if (chore.OnThursday)
                {
                    assignments.Add(new AssignmentSummary(chore.Id, childId, chore.Description, Day.Thursday, false, false));
                }
                if (chore.OnFriday)
                {
                    assignments.Add(new AssignmentSummary(chore.Id, childId, chore.Description, Day.Friday, false, false));
                }
                if (chore.OnSaturday)
                {
                    assignments.Add(new AssignmentSummary(chore.Id, childId, chore.Description, Day.Saturday, false, false));
                }
            }

            return assignments.OrderBy(x => x.Day).ToList();
        }

        private void Initialize()
        {
            Users = new Dictionary<int, User>();
            Users.Add(1, new User(1, "John"));
            Users.Add(2, new User(2, "Mary"));

            Chores = new Dictionary<int, Chore>();
            Chores.Add(1, new Chore(1, 1, "Do Dishes", onMonday: true, onWednesday: true, onFriday: true, onSaturday: true));
            Chores.Add(2, new Chore(2, 1, "Take Out Trash", onWednesday: true ));
            Chores.Add(5, new Chore(5, 1, "Clean Room", onSunday: true ));
            Chores.Add(3, new Chore(3, 2, "Do Dishes", onTuesday: true, onThursday: true, onSunday: true ));
            Chores.Add(4, new Chore(4, 2, "Clean Room", onSaturday: true ));
        }
    }
}