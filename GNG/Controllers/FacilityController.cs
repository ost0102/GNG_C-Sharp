using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GNG.Controllers
{
    public class FacilityController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.MENU3 = "Facility";
            return View();
        }

    }
}