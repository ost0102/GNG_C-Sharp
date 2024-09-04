using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GNG.Controllers
{
    public class CompanyController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.MENU1 = "Company";
            return View();
        }

    }
}