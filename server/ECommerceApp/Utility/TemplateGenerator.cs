using ECommerceApp.Dto;
using ECommerceApp.Entities;
using Humanizer;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text;

namespace ECommerceApp.Utility
{
    public class TemplateGenerator
    {
        public static string GetHTMLString()
        {
            var employees = DataStorage.GetAllEmployees();
            var sb = new StringBuilder();
            sb.Append(@"
            <!DOCTYPE html>
            <html lang=""en"">
            <head>
                <meta charset=""UTF-8"">
                <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
                <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                <title>Deneme</title>
                <!-- <link href=""https://localhost:44303/resources/css/style.css"" rel=""stylesheet""> -->
                <!-- <link href=""https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"" rel=""stylesheet"" integrity=""sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"" crossorigin=""anonymous""> -->
            </head>
            <body>
                <div class='header'><h1>Fatura</h1></div>
                <table align='center' class=""table table-primary table-striped text-center text-danger"">
                    <tr>
                        <td class=""text-danger"">Id</td>
                        <td>Name</td>
                        <td>Age</td>
                        <td>Position</td>
                        <td>CompanyId</td>
                    </tr>
            
            ");

            foreach (var employee in employees)
            {
                sb.AppendFormat(@"
                    <tr>
                        <td>{0}</td>
                        <td>{1}</td>
                        <td>{2}</td>
                        <td>{3}</td>
                        <td>{4}</td>
                    </tr>", employee.Id, employee.Name, employee.Age, employee.Position, employee.CompanyId);
            }

            sb.Append(@"
                </table>
            <div style=""display: flex; justify-content: space-between;"">
              <div>A</div>
              <div>B</div>
            </div>
            </body>
            </html>
            ");

            return sb.ToString();
        }

        public static string GetInvoiceString(OrderDto order)
        {
            var sb = new StringBuilder();
            sb.Append($@"
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset=""UTF-8"" />
                <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"" />
                <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
                <title>Fatura | Aykuthrmnc</title>
                <style>
                  @page {{
                    size: A4;
                    margin: 0;
                  }} 
                  /* @media print {{
                    @page {{
                      width: 21cm;
                      height: 29.7cm;
                      margin: 0 auto;
                    }}
                  }} */

                  body {{
                    width: 21cm;
                    height: 29.7cm;
                    margin: 0 auto;
                  }}

                  .invoice-title {{
                    font-size: 36px;
                    color: #333;
                  }}

                  .invoice-header {{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                  }}

                  .invoice-header,
                  .invoice-footer {{
                    padding: 20px;
                  }}

                  .invoice-header {{
                    border-bottom: 1px solid #eee;
                  }}

                  .invoice-footer {{
                    border-top: 1px solid #eee;
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    text-align: center;
                    margin-top: auto;
                  }}

                  .invoice-items {{
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                  }}

                  .invoice-item {{
                    width: 35%;
                    margin-bottom: 10px;
                  }}

                  .invoice-item .item-name {{
                    font-weight: bold;
                  }}

                  img {{
                    width: 100%;
                    height: auto;
                  }}

                  .invoice-left,
                  .invoice-right {{
                    width: 35%;
                  }}

                  .invoice-center {{
                    width: 15%;
                    text-align: center;
                  }}

                  .invoice-right {{
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                  }}

                  .container {{
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                  }}

                  table {{
                    border-collapse: collapse;
                    width: 100%;
                  }}

                  tbody,
                  th,
                  tfoot tr td:nth-child(2) {{
                    border: 2px solid #210fab;
                  }}

                  tbody tr td {{
                    border-right: 2px solid #210fab;
                  }}

                  tfoot tr td:nth-child(2) div {{
                    display: flex;
                    justify-content: space-between;
                  }}
                </style>
              </head>
              <body>
                <div class=""container"">
                  <div class=""invoice-header"">
                    <div class=""invoice-left"">
                      <h1 class=""invoice-title"">Fatura</h1>
                      <strong>AYKUT HARMANCI</strong>
                      <div><strong>Adres:</strong> Selçuklu/KONYA</div>
                      <div><strong>Tel:</strong> +905555555555</div>
                      <div><strong>Web Sitesi:</strong> aykuthrmnc.com</div>
                    </div>
                    <div class=""invoice-center"">
                      <img src=""https://localhost:44303/resources/html/gib_400px.png"" />
                      <strong>E-Arşiv Fatura</strong>
                    </div>
                    <div class=""invoice-right"">
                      <strong>Fatura Tipi:</strong> SATIS <strong>Sipariş Tarihi:</strong> {order.CreatedAt?.ToString("dd.MM.yyyy")} <strong>Sipariş Zamanı:</strong> {order.CreatedAt?.ToString("HH:mm")} <strong>Sipariş Numarası:</strong> {order.Id}
                    </div>
                  </div>
                  <div class=""invoice-items"">
                    <div class=""invoice-item"">
                      <div class=""item-name"">Teslimat Adresi</div>
                      <div>{order.AddressLine1}</div>
                    </div>
                    <div class=""invoice-item"">
                      <div class=""item-name"">Fatura Adresi</div>
                      <div>{order.AddressLine1}</div>
                    </div>
                    <!-- Add more invoice items as needed -->
                  </div>
                  <div class=""invoice-products"">
                    <table class=""table"">
                      <thead>
                        <tr>
                          <th width=""50%"">Açıklama</th>
                          <th>Birim Fiyat</th>
                          <th>Adet</th>
                          <th>Tutar</th>
                        </tr>
                      </thead>
                      <tbody>
            ");

            decimal totalPrice = 0;

            foreach (var item in order.OrderItems)
            {
                totalPrice += item.Price * item.Quantity;
                sb.AppendFormat(@"
                    <tr>
                        <td>{0}</td>
                        <td>{1}</td>
                        <td>{2}</td>
                        <td>{3}</td>
                    </tr>", item.Name, item.Price.ToString("N03"), item.Quantity, (item.Price * item.Quantity).ToString("N03"));
                // .ToString("C", new CultureInfo("tr-TR")))
            }

            sb.Append($@"
            </tbody>
                      <tfoot>
                        <tr>
                          <td colspan=""2""></td>
                          <td colspan=""2"">
                            <div>
                              <div>Mal Hizmet Toplam Tutarı</div>
                              <div>{totalPrice.ToString("N03")} TL</div>
                            </div>
                            <div>
                              <div>Ödenecek Tutar</div>
                              <div>{totalPrice.ToString("N03")} TL</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colspan=""4"">
                            {GetNumber(totalPrice)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div class=""invoice-footer"">
                    <div>AYKUT HARMANCI</div>
                  </div>
                </div>
              </body>
            </html>
            ");

            return sb.ToString();
        }

        public static string GetNumber(decimal number)
        {
            long leftNumber = (long)number;
            long rightNumber = (long)((number - Convert.ToDecimal(leftNumber)) * 100);
            var culture = new CultureInfo("tr-TR");
            var result = leftNumber.ToWords(culture).Dehumanize().ToUpper();
            var result2 = rightNumber.ToWords(culture).Dehumanize().ToUpper();
            return $"YALNIZCA {result} TL {result2} KR";
        }
    }
}
