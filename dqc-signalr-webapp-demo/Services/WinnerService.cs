using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dqc_signalr_webapp_demo.Services
{
    public class WinnerService
    {
        private Dictionary<string, string> raffleNumbers = new Dictionary<string, string>();

        public Dictionary<string, string> RaffleNumbers
        {
            get { return raffleNumbers; }
        }

        public int PotentialWinners
        {
            get;
            set;
        }

        public KeyValuePair<string, string> PickAWinner()
        {
            Random random = new Random((int)DateTime.UtcNow.Ticks);

            string key = RaffleNumbers.Keys.ElementAt(random.Next(RaffleNumbers.Keys.Count));

            return RaffleNumbers.FirstOrDefault(_ => _.Key == key);
        }
    }
}
