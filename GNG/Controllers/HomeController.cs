using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.IO;
using System.Net.Mail;
using GNG.Yjit_Utils;
using Newtonsoft.Json;
using System.Web.Mail;

using System.Configuration;

namespace GNG.Controllers
{
    public class HomeController : Controller
    {
        Encryption ec = new Encryption();
        string strJson = "";
        string strResult = "";
        public class JsonData
        {
            public string vJsonData { get; set; }
        }
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        //제보하기 전송
        public ActionResult fnSendEmail(JsonData value)
        {
            try
            {
                //var appKey = ConfigurationManager.AppSettings["Email"];

                DataTable dt = JsonConvert.DeserializeObject<DataTable>(value.vJsonData.ToString());


                ////보내는주소 이메일, 발송자이름, UTF-8
                //mailMessage.From = new MailAddress(appKey, "", System.Text.Encoding.UTF8);
                ////받는 이메일주소
                //mailMessage.To.Add("jhkim@skyrd.co.kr");
                ////참조 이메일
                ////mailMessage.CC.Add("ekkim@yjit.co.kr");
                ////숨은참조 이메일
                ////mailMessage.Bcc.Add("dhkim@yjit.co.kr");
                ///

                #region  기존 587 로직

                //MailAddress from = new MailAddress(dt.Rows[0]["EMAIL"].ToString());
                //MailAddress to = new MailAddress(appKey);


                //MailMessage mailMessage = new MailMessage(from, to);
                ////mailMessage.CC.Add("ekkim@yjit.co.kr"); //메일테스트 체크용
                ////제목
                //mailMessage.Subject = dt.Rows[0]["TITLE"].ToString();
                //mailMessage.SubjectEncoding = System.

                //Text.Encoding.UTF8;
                ////내용
                //mailMessage.Body =            
                //"회사명 : " + dt.Rows[0]["EMAIL"].ToString() + "\n" + "\n" + "고객명 : " + dt.Rows[0]["USER"].ToString() + "\n" + "\n" + "연락처 : " + dt.Rows[0]["TEL"].ToString() + "\n" + "\n" + "이메일 : " + dt.Rows[0]["EMAIL"].ToString() + "\n" + "\n" + "제목 : " + dt.Rows[0]["TITLE"].ToString() + "\n" + "\n" + "내용 : " + dt.Rows[0]["CONTENTS"].ToString();
                //mailMessage.IsBodyHtml = false;
                //mailMessage.BodyEncoding = System.Text.Encoding.UTF8;

                //// SMTP 서버 주소
                //SmtpClient SmtpServer = new SmtpClient("mail.yjit.co.kr"); // 호스트
                //// SMTP 포트
                //SmtpServer.Port = 587;  // 포트 
                //// SSL 사용 여부
                //SmtpServer.EnableSsl = false;
                //SmtpServer.UseDefaultCredentials = false;
                //SmtpServer.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                //SmtpServer.Credentials = new System.Net.NetworkCredential("mailmaster@yjit.co.kr", "Yjit0921)#$%"); //  ID, PW 

                ////System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient("mail.w.skyrd.co.kr", 587)
                ////{
                ////    UseDefaultCredentials = false,
                ////    EnableSsl = true,
                ////    DeliveryMethod = SmtpDeliveryMethod.Network,
                ////    Credentials = new System.Net.NetworkCredential("jhkim@skyrd.co.kr", "srex1671!!"),
                ////    Timeout = 100000

                ////};

                //System.Net.ServicePointManager.ServerCertificateValidationCallback += (s, cert, chain, sslPolicyErrors) => true;

                //SmtpServer.Send(mailMessage);
                ////client.Send(mailMessage);
                //mailMessage.Dispose();

                #endregion
                DateTime dateT = DateTime.Now;
                string datePart = dateT.ToString("yyyy-MM-dd");


                //메일  양식 만들기 
                //string mailBody = makeMailForm(dt);

                SendEmail_PORT465("[Dev(주)GNG]" + datePart + " 온라인 문의 - " + dt.Rows[0]["EMAIL"].ToString() + " 님의 문의입니다. ", MakeRCRTEmailForm(dt), dt); // 제목 , 내용 , 정보 테이블

                strResult = MakeJson("Y", "이메일 전송 성공");
                strJson = ec.decryptAES256(strResult);
                return Json(strJson);
            }
            catch (Exception e)
            {
                strResult = MakeJson("N", e.Message);
                strJson = ec.decryptAES256(strResult);
            }
            return Json(strJson);
        }

        [HttpPost]
        public void SendEmail_PORT465(string strSubject, string strBody, DataTable dt) //dt -> 송신인 메일
        {
            var appKey = ConfigurationManager.AppSettings["Email"].ToString();

            //DataTable dt = JsonConvert.DeserializeObject<DataTable>(value.vJsonData.ToString());

            System.Web.Mail.MailMessage msg = new System.Web.Mail.MailMessage();
            msg.Subject = strSubject; // 고정 제목

            msg.Body = strBody; // 요청자 정보 , 문의 제목 , 내용 .. (html로)
            msg.BodyFormat = System.Web.Mail.MailFormat.Html;
            msg.BodyEncoding = System.Text.Encoding.UTF8;

            //msg.Priority = System.Web.Mail.MailPriority.High;

            msg.From = dt.Rows[0]["EMAIL"].ToString();

            //실운영
            msg.To = appKey;

            msg.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpserver", "smtps.hiworks.com"); // 
            msg.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpserverport", "465"); //
            msg.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendusing", "2");

            msg.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate", "1");
            //User name
            msg.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendusername", "gng9000@mygng.kr"); //

            msg.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendpassword", "gngcfs9090."); // 
            msg.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpusessl", "true");

            System.Web.Mail.SmtpMail.SmtpServer = "smtps.hiworks.com"; //
            System.Web.Mail.SmtpMail.Send(msg);


        }

        public string MakeJson(string status, string Msg)
        {
            try
            {
                string json = "";
                DataSet ds = new DataSet();
                DataTable dt = new DataTable();
                dt.Columns.Add("trxCode");
                dt.Columns.Add("trxMsg");
                DataRow row1 = dt.NewRow();
                row1["trxCode"] = status;
                row1["trxMsg"] = Msg;
                dt.Rows.Add(row1);
                dt.TableName = "Result";
                ds.Tables.Add(dt);
                json = ec.encryptAES256(JsonConvert.SerializeObject(ds, Formatting.Indented));
                return json;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public string MakeRCRTEmailForm(DataTable dt)
        {
            string str1 = dt.Rows[0]["CONTENTS"].ToString();
            string[] array1 = str1.Split('\n');
            string vHtml = "";

            vHtml += "<div style=\"width:800px; display:flex; flex-direction:column; gap:20px;\">";
            vHtml += "  <div style=\"display:flex;\">";
            vHtml += "      <span style=\"font-size:16px; font-weight:bold; width:60px;\">제목 : </span>";
            vHtml += "      <span style=\"font-size:16px; width:740px;\">" + dt.Rows[0]["TITLE"].ToString() + "</span>";
            vHtml += "  </div>";
            vHtml += "  <div style=\"display:flex;\">";
            vHtml += "      <span style=\"font-size:16px; font-weight:bold; width:60px;\">회사명 : </span>";
            vHtml += "      <span style=\"font-size:16px; width:740px;\">" + dt.Rows[0]["CUST"].ToString() + "</span>";
            vHtml += "  </div>";
            vHtml += "  <div style=\"display:flex;\">";
            vHtml += "      <span style=\"font-size:16px; font-weight:bold; width:60px;\">고객명 : </span>";
            vHtml += "      <span style=\"font-size:16px; width:740px;\">" + dt.Rows[0]["USER"].ToString() + "</span>";
            vHtml += "  </div>";
            vHtml += "  <div style=\"display:flex;\">";
            vHtml += "      <span style=\"font-size:16px; font-weight:bold; width:60px;\">연락처 : </span>";
            vHtml += "      <span style=\"font-size:16px; width:740px;\">" + dt.Rows[0]["TEL"].ToString() + "</span>";
            vHtml += "  </div>";
            vHtml += "  <div style=\"display:flex;\">";
            vHtml += "      <span style=\"font-size:16px; font-weight:bold; width:60px;\">이메일 : </span>";
            vHtml += "      <span style=\"font-size:16px; width:740px;\">" + dt.Rows[0]["EMAIL"].ToString() + "</span>";
            vHtml += "  </div>";
            vHtml += "  <div style=\"display:flex;\">";
            vHtml += "      <span style=\"font-size:16px; font-weight:bold; width:60px;\">내용 : </span>";
            foreach (var row in array1)
            {
                vHtml += "                                 <span style=\"font-size:16px; width:740px;\">" + row + "</span>";
            }
            vHtml += "  </div>";
            vHtml += "</div>";


            return vHtml;
        }
    }
}