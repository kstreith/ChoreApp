using ChoreApp.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace ChoreApp
{
    public class ChoreRepository
    {
        private ConcurrentDictionary<int, User> Users { get; set; }
        private ConcurrentDictionary<int, Chore> Chores { get; set; }
        private int MaxUserId;
        private int MaxChoreId;
        private static Lazy<ChoreRepository> _repo = new Lazy<ChoreRepository>();

        public ChoreRepository()
        {
            Users = new ConcurrentDictionary<int, User>();
            Chores = new ConcurrentDictionary<int, Chore>();
            Initialize();
        }

        public static ChoreRepository GetInstance()
        {
            return _repo.Value;
        }

        public List<User> GetAllUsers()
        {
            return Users.Values.OrderBy(x => x.Id).ToList();
        }

        public List<Chore> GetAllChores()
        {
            /*var chores = new List<Chore>();
            foreach (var i in Chores.Values)
            {
                chores.Add(i);
            }
            return chores;*/

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
            Users.Clear();
            Chores.Clear();
            Interlocked.Exchange(ref MaxUserId, 0);
            Interlocked.Exchange(ref MaxChoreId, 0);

            var userId = Interlocked.Increment(ref MaxUserId);
            var user = new User(userId, "John");
            Users.TryAdd(userId, user);
            var choreId = Interlocked.Increment(ref MaxChoreId);
            var chore = new Chore(choreId, userId, "Do Dishes", onMonday: true, onWednesday: true, onFriday: true, onSaturday: true);
            Chores.TryAdd(choreId, chore);
            choreId = Interlocked.Increment(ref MaxChoreId);
            chore = new Chore(choreId, userId, "Take Out Trash", onWednesday: true);
            Chores.TryAdd(choreId, chore);
            choreId = Interlocked.Increment(ref MaxChoreId);
            chore = new Chore(choreId, userId, "Clean Room", onSunday: true);
            Chores.TryAdd(choreId, chore);


            userId = Interlocked.Increment(ref MaxUserId);
            user = new User(userId, "Mary");
            Users.TryAdd(userId, user);
            choreId = Interlocked.Increment(ref MaxChoreId);
            chore = new Chore(choreId, userId, "Do Dishes", onTuesday: true, onThursday: true, onSunday: true);
            Chores.TryAdd(choreId, chore);
            choreId = Interlocked.Increment(ref MaxChoreId);
            chore = new Chore(choreId, userId, "Clean Room", onSaturday: true);
            Chores.TryAdd(choreId, chore);
        }

        public User GetUser(int id)
        {
            return Users[id];
        }

        public void AddUser(User value)
        {
            var userId = Interlocked.Increment(ref MaxUserId);
            var user = new User(userId, value.Name);
            Users.TryAdd(userId, user);
        }

        public void EditUser(int id, User value)
        {
            var user = Users[id];
            if (user != null)
            {
                var editUser = new User(id, value.Name);
                Users[id] = editUser;
            }
        }

        public void DeleteUser(int id)
        {
            User user = null;
            Users.TryRemove(id, out user);
        }
    }
}