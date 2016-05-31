using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace ChoreApp.Filters
{
    public class MakeSlowFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext context) {
            var headers = context.Request.Headers;
            if (headers.Contains("tri-delay"))
            {
                var value = headers.GetValues("tri-delay").FirstOrDefault();
                int delay = 0;
                if (Int32.TryParse(value, out delay))
                {
                    Thread.Sleep(delay * 1000);
                }
            }
        }
    }
}