using dqc_signalr_webapp_demo.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

public class RaffleHub : Hub
{
    public RaffleHub(WinnerService winnerService)
    {
        WinnerService = winnerService;
    }

    public WinnerService WinnerService { get; }

    public void EnterRaffle(string raffleNumber)
    {
        WinnerService.RaffleNumbers.TryAdd(raffleNumber, Context.ConnectionId);
        Clients.All.SendAsync("raffleEntries", WinnerService.RaffleNumbers.Keys.Count);
    }

    public override Task OnConnectedAsync()
    {
        WinnerService.PotentialWinners++;
        Clients.All.SendAsync("clientsConnected", WinnerService.PotentialWinners);
        Clients.All.SendAsync("raffleEntries", WinnerService.RaffleNumbers.Keys.Count);

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        if (WinnerService.RaffleNumbers.ContainsValue(Context.ConnectionId))
        {
            var keyValuePair = WinnerService.RaffleNumbers.FirstOrDefault(_ => _.Value == Context.ConnectionId);
            WinnerService.RaffleNumbers.Remove(keyValuePair.Key);
            Clients.All.SendAsync("raffleEntries", WinnerService.RaffleNumbers.Keys.Count);
        }

        WinnerService.PotentialWinners--;
        Clients.All.SendAsync("clientsConnected", WinnerService.PotentialWinners);

        return base.OnDisconnectedAsync(exception);
    }
}