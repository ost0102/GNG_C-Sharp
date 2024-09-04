using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GNG.Controllers
{
    public class BusinessController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.MENU2 = "Business";
            return View();
        }

    }
}