
import axios from "axios";

const BASE =
  "https://api.anakin.io/v1";

function sleep(ms: number) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

export async function scrapeWebsite(
  url: string
) {

  try {

    console.log(
      "Using API KEY:",
      process.env.ANAKIN_API_KEY
        ? "FOUND"
        : "MISSING"
    );

    // STEP 1
    // SUBMIT SCRAPE JOB

    const submitResponse =
      await axios.post(

        `${BASE}/url-scraper`,

        {
          url,

          // FAST MODE
          generateJson: false,

          // NO BROWSER RENDERING
          useBrowser: false
        },

        {
          headers: {

            "X-API-Key":
              process.env.ANAKIN_API_KEY,

            "Content-Type":
              "application/json"
          }
        }
      );

    console.log(
      "ANAKIN SUBMIT:",
      submitResponse.data
    );

    const jobId =
      submitResponse.data.jobId;

    if (!jobId) {
      throw new Error(
        "No jobId returned"
      );
    }

    // STEP 2
    // POLL FOR RESULT

    for (let i = 0; i < 40; i++) {

      console.log(
        `Polling attempt ${i + 1}`
      );

      // wait 3 sec
      await sleep(3000);

      const jobResponse =
        await axios.get(

          `${BASE}/url-scraper/${jobId}`,

          {
            headers: {
              "X-API-Key":
                process.env.ANAKIN_API_KEY
            }
          }
        );

      const job =
        jobResponse.data;

      console.log(
        "JOB STATUS:",
        job.status
      );

      // SUCCESS

      if (
        job.status === "completed"
      ) {

        console.log(
          "SCRAPE COMPLETED"
        );

        return {

          title:
            job.title
            || new URL(url).hostname,

          content:
            job.markdown
            || job.content
            || "No content",

          generatedJson:
            job.generatedJson
            || null
        };
      }

      // FAILURE

      if (
        job.status === "failed"
      ) {

        throw new Error(
          job.error
          || "Scrape failed"
        );
      }
    }

    // TIMEOUT

    throw new Error(
      "Timed out waiting for scrape"
    );

  } catch (error: any) {

    console.error(
      "ANAKIN ERROR:"
    );

    console.error(
      error.response?.data
      || error.message
    );

    throw error;
  }
}

