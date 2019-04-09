using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dqc_signalr_webapp_demo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace dqc_signalr_webapp_demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PickAWinnerController : ControllerBase
    {
        private IHubContext<RaffleHub> RaffleHub { get; }
        private WinnerService WinnerService { get; }

        public PickAWinnerController(IHubContext<RaffleHub> raffleHub, WinnerService winnerService)
        {
            RaffleHub = raffleHub;
            WinnerService = winnerService;
        }

        // GET: api/PickAWinner
        [HttpGet]
        public IActionResult Get()
        {
            var winner = WinnerService.PickAWinner();

            PickingWinner();

            Task.Delay(1000).Wait();

            CongratulateWinner(winner.Key);
            NotifyLoosers(winner.Key);
            Reset();

            return Ok(winner);
        }

        [HttpPost]
        public IActionResult Reset()
        {
            WinnerService.RaffleNumbers.Clear();

            return Ok();
        }

        private void PickingWinner()
        {
            RaffleHub.Clients.All.SendAsync("pickingwinner");
        }

        private void CongratulateWinner(string raffleNumber)
        {
            RaffleHub.Clients.Client(WinnerService.RaffleNumbers[raffleNumber]).SendAsync("congrats", raffleNumber);
        }

        private void NotifyLoosers(string raffleNumber)
        {
            RaffleHub.Clients.AllExcept(WinnerService.RaffleNumbers[raffleNumber]).SendAsync("lost", raffleNumber);
        }
    }
}
