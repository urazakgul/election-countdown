const paths = document.querySelectorAll("path");

const electionDate = new Date("13 May 2023 23:59:59");

function updateCountdown() {
  let selectedProvince = "";
  let time = [];
  let akpVotes = [];
  let chpVotes = [];

  fetch("db.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        if (item.Province === selectedProvince) {
          time.push(item.Date);
          akpVotes.push(item.AKP);
          chpVotes.push(item.CHP);
        }
      });

      const chartData = {
        labels: time,
        datasets: [
          {
            label: "AKP",
            data: akpVotes,
            fill: false,
            backgroundColor: "orange",
            borderColor: "orange",
            pointBackgroundColor: "orange",
            pointBorderColor: "orange",
            pointRadius: 7,
          },
          {
            label: "CHP",
            data: chpVotes,
            fill: false,
            backgroundColor: "red",
            borderColor: "red",
            pointBackgroundColor: "red",
            pointBorderColor: "red",
            pointRadius: 7,
          },
        ],
      };

      if (daysLeft >= 0) {
        const chartConfig = {
          type: "line",
          data: chartData,
          options: {
            scales: {
              x: {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 25,
                },
              },
              y: {
                scaleLabel: {
                  display: true,
                  labelString: "Percentage",
                },
                ticks: {
                  suggestedMax: 100,
                  stepSize: 25,
                  beginAtZero: true,
                },
              },
            },
            plugins: {
              tooltip: {
                intersect: false,
                mode: "index",
              },
              legend: {
                labels: {
                  font: {
                    size: 16,
                  },
                },
              },
            },
            responsive: true,
            interaction: {
              mode: "nearest",
              axis: "x",
            },
            plugins: [
              {
                beforeDraw: function (chart) {
                  var ctx = chart.ctx;
                  ctx.fillStyle = "white";
                  ctx.fillRect(0, 0, chart.width, chart.height);
                },
              },
            ],
            style: {
              backgroundColor: "white",
            },
            colors: ["orange", "red"],
          },
        };

        const chartElement = document.getElementById("myChart");
        chart = new Chart(chartElement, chartConfig);
      }
    });

  const now = new Date();
  const diff = electionDate.getTime() - now.getTime();

  const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const minutesLeft = Math.floor((diff / 1000 / 60) % 60);
  const secondsLeft = Math.floor((diff / 1000) % 60);

  if (diff < 0) {
    daysLeft = 0;
    hoursLeft = 0;
    minutesLeft = 0;
    secondsLeft = 0;
  }

  paths.forEach(function (path) {
    const title = path.getAttribute("title");
    const id = path.getAttribute("id");
    if (daysLeft === 0) {
      selectedProvince = "Türkiye";
      path.style.fill = "#b2b2b2";
      path.style.strokeWidth = "0.2";
    } else if (daysLeft === parseInt(id.split("-")[1])) {
      selectedProvince = title;
      path.style.fill = "#000";
    } else if (daysLeft < parseInt(id.split("-")[1])) {
      path.style.fill = "#b2b2b2";
    } else {
      path.style.fill = "#fff";
      path.style.stroke = "#000";
      path.style.strokeWidth = "0.2";
    }
  });

  const provinceText = document.querySelector(
    ".target-province"
  );
  const daysElement = document.querySelector(
    ".countdown .time:nth-child(1) h3"
  );
  const hoursElement = document.querySelector(
    ".countdown .time:nth-child(2) h3"
  );
  const minutesElement = document.querySelector(
    ".countdown .time:nth-child(3) h3"
  );
  const secondsElement = document.querySelector(
    ".countdown .time:nth-child(4) h3"
  );

  provinceText.textContent = selectedProvince.toUpperCase();
  daysElement.textContent = daysLeft.toString().padStart(2, "0");
  hoursElement.textContent = hoursLeft.toString().padStart(2, "0");
  minutesElement.textContent = minutesLeft.toString().padStart(2, "0");
  secondsElement.textContent = secondsLeft.toString().padStart(2, "0");
}

setInterval(updateCountdown, 1000);
