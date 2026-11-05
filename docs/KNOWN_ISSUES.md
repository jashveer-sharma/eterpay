# Known Issues & Risk Log — EterPay

## 1. Host Machine Runtime Missing
* **Issue:** Node.js, Python, and Git are not currently in the Windows host `PATH`.
* **Impact:** Prevents running `npm install` and `pip install` locally until user completes Action 1 & Action 2 in `INSTALLATION_TRACKER.md`.
* **Mitigation:** Clear 1-click winget / installer commands documented for the user.

## 2. Gemini Free Tier Rate Limit (15 RPM)
* **Risk:** Burst prompts during demo could trigger `429 Too Many Requests`.
* **Mitigation:** Instant automated fallback to Groq Llama 3.3 70B (30 RPM).

## 3. Render Free Tier Sleep Time
* **Risk:** Inactive web services spin down after 15 minutes of inactivity.
* **Mitigation:** Warm up the service 5 minutes before recording the demo video; provide clear setup docs for local evaluation.
