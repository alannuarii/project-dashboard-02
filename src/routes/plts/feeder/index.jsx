// src/routes/plts/bss/index.tsx
import { createSignal, onCleanup, onMount, Show, For, createMemo, createEffect } from "solid-js";
import { A } from "@solidjs/router";
import { fetchPMData } from "~/lib/fetching/plts";
import Feeder from "~/components/PLTS/Feeder/Feeder";
import { updateChart, initChart } from "~/lib/utils/chart";

export default function FeederPage() {
  const [lvsw1Data, setLvsw1Data] = createSignal([]);
  const [lvsw2Data, setLvsw2Data] = createSignal([]);
  const [totalLvswData, setTotalLvsw2Data] = createSignal([]);
  const [error, setError] = createSignal(null);

  const totalActiveChartData = [];
  const totalReactiveChartData = [];
  const lvsw1ChartData = [];
  const lvsw2ChartData = [];

  let totalActiveChart, totalReactiveChart, lvsw1Chart, lvsw2Chart;
  let totalActiveRef, totalReactiveRef, lvsw1Ref, lvsw2Ref;

  const fetchLvsw1 = async () => {
    try {
      const lvsw = await fetchPMData("LVSW1");
      setLvsw1Data(lvsw);
      if (lvsw.length > 0) {
        const lvsw1 = lvsw[0]?._value || 0;
        updateChart(lvsw1Chart, [lvsw1]);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error LVSW1:", err);
    }
  };

  const fetchLvsw2 = async () => {
    try {
      const lvsw = await fetchPMData("LVSW2");
      setLvsw2Data(lvsw);
      if (lvsw.length > 0) {
        const lvsw2 = lvsw[0]?._value || 0;
        updateChart(lvsw2Chart, [lvsw2]);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error LVSW2:", err);
    }
  };

  const fetchTotalLvsw = async () => {
    try {
      const lvsw = await fetchPMData("totlvsw");
      setTotalLvsw2Data(lvsw);
      if (lvsw.length > 0) {
        const totActive = lvsw[0]?._value || 0;
        updateChart(totalActiveChart, [totActive]);
        const totReactive = lvsw[1]?._value || 0;
        updateChart(totalReactiveChart, [totReactive]);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error Total LVSW:", err);
    }
  };

  onMount(() => {
    fetchLvsw1();
    fetchLvsw2();
    fetchTotalLvsw();
    const lvsw1Interval = setInterval(fetchLvsw1, 1000);
    const lvsw2Interval = setInterval(fetchLvsw2, 1000);
    const totalLvswInterval = setInterval(fetchTotalLvsw, 1000);
    onCleanup(() => {
      clearInterval(lvsw1Interval);
      clearInterval(lvsw2Interval);
      clearInterval(totalLvswInterval);
    });
  });

  onMount(() => {
    lvsw1Chart = initChart(lvsw1Ref, "Active Power", lvsw1ChartData, ["kW"], ["#4caf50"]);
    lvsw2Chart = initChart(lvsw2Ref, "Active Power", lvsw2ChartData, ["kW"], ["#ff9800"]);
    totalActiveChart = initChart(totalActiveRef, "Active Power Total", totalActiveChartData, ["kW"], ["#2196f3"]);
    totalReactiveChart = initChart(totalReactiveRef, "Reactive Power Total", totalReactiveChartData, ["kVAR"], ["#f44336"]);
  });

  return (
    <section class="desktop">
      <div class="container-fluid">
        <Show
          when={error()}
          fallback={
            <div class="row text-center">
              <div class="col-4">
                <div class="card bg-dark rounded-0 border-2 border-light p-2 text-center">
                  <div class="mb-2">
                    <Feeder lvswData={[lvsw1Data(), lvsw2Data()]} />
                  </div>
                </div>
              </div>
              <div class="col-8">
                <div class="d-flex ms-3">
                  <A href={`/plts/bss/timeframe`} class="mb-2 rounded-0 btn btn-sm btn-light">
                    Timeframe Total
                  </A>
                  <A href={`/plts/bss/timeframe/1`} class="mb-2 rounded-0 btn btn-sm btn-light">
                    Timeframe Feeder 1
                  </A>
                  <A href={`/plts/bss/timeframe/2`} class="mb-2 rounded-0 btn btn-sm btn-light">
                    Timeframe Feeder 2
                  </A>
                </div>
                <div class="row gx-0 mb-4">
                  <div class="col-6">
                    <div class="card border-2 border-light rounded-0 mb-2 mx-3">
                      <div class="card-header bg-dark text-light">Active Power PLTS Sangihe</div>
                      <div class="card-body bg-dark-subtle">
                        <canvas ref={totalActiveRef}></canvas>
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="card border-2 border-light rounded-0 mb-2 mx-3">
                      <div class="card-header bg-dark text-light">Reactive Power PLTS Sangihe</div>
                      <div class="card-body bg-dark-subtle">
                        <canvas ref={totalReactiveRef}></canvas>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row gx-0">
                  <div class="col-6">
                    <div class="card border-2 border-light rounded-0 mb-2 mx-3">
                      <div class="card-header bg-dark text-light">Active Power Feeder 1</div>
                      <div class="card-body bg-dark-subtle">
                        <canvas ref={lvsw1Ref}></canvas>
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="card border-2 border-light rounded-0 mb-2 mx-3">
                      <div class="card-header bg-dark text-light">Active Power Feeder 2</div>
                      <div class="card-body bg-dark-subtle">
                        <canvas ref={lvsw2Ref}></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <p class="text-center text-light p-5">Error: {error()}</p>
        </Show>
      </div>
    </section>
  );
}
