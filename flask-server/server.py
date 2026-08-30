from flask import Flask, request, jsonify, render_template_string

app = Flask(__name__)

responses = []

DASHBOARD_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Madam Dashboard</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: 'Segoe UI', sans-serif;
        color: #2d2a3d;
        background: linear-gradient(135deg, #f3ecff 0%, #e7d9ff 50%, #dfd0ff 100%);
        padding: 40px 20px;
      }
      .dashboard {
        max-width: 720px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(176, 155, 255, 0.3);
        border-radius: 28px;
        padding: 30px;
        box-shadow: 0 28px 60px rgba(148, 117, 255, 0.16);
      }
      .eyebrow {
        margin: 0;
        font-size: 0.72rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #8e7cc7;
        font-weight: 700;
      }
      h1 {
        margin: 8px 0 4px;
        font-size: 2rem;
        color: #4a3d86;
      }
      .sub {
        margin: 0 0 24px;
        color: #736b8d;
      }
      .empty {
        text-align: center;
        color: #8e7cc7;
        padding: 40px 0;
        font-style: italic;
      }
      .response-item {
        background: linear-gradient(135deg, #f7f0ff 0%, #edf4ff 100%);
        border: 1px solid rgba(162, 138, 246, 0.16);
        border-radius: 16px;
        padding: 14px 18px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .num {
        width: 34px;
        height: 34px;
        flex-shrink: 0;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: linear-gradient(135deg, #8e7ae9 0%, #b892ff 100%);
        color: #fff;
        font-weight: 700;
        font-size: 0.9rem;
      }
      .response-text {
        margin: 0;
        color: #3e3d4d;
        font-size: 1rem;
        word-break: break-word;
      }
      .response-body {
        flex: 1;
        min-width: 0;
      }
      .checklist {
        margin: 8px 0 0;
        padding-left: 20px;
        color: #5740a7;
        font-size: 0.9rem;
        list-style: none;
      }
      .checklist li {
        margin-bottom: 2px;
      }
      .checklist li[data-checked]:before,
      .checklist li:before {
        content: '\2713 ';
        color: #8e7ae9;
        font-weight: 700;
      }
      .count {
        text-align: right;
        margin-top: 16px;
        color: #5740a7;
        font-weight: 700;
        font-size: 0.9rem;
      }
      .refresh {
        display: inline-block;
        margin-top: 12px;
        padding: 10px 22px;
        border: none;
        border-radius: 999px;
        background: linear-gradient(135deg, #8e7ae9 0%, #b892ff 100%);
        color: #fff;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
        font-family: inherit;
        font-size: 0.9rem;
      }
    </style>
  </head>
  <body>
    <div class="dashboard">
      <p class="eyebrow">Madam Dashboard</p>
      <h1>Responses</h1>
      <p class="sub">Messages sent from the inbox by cuteton</p>
      {% if responses %}
        {% for response in responses %}
          <div class="response-item">
            <span class="num">{{ loop.index }}</span>
            <div class="response-body">
              <p class="response-text">{{ response.text }}</p>
              {% if response.checklist %}
                <ul class="checklist">
                  {% for item in response.checklist %}
                    <li>{{ item }}</li>
                  {% endfor %}
                </ul>
              {% endif %}
            </div>
          </div>
        {% endfor %}
        <p class="count">{{ responses|length }} response(s)</p>
      {% else %}
        <p class="empty">No responses yet. Wait for cuteton to reply! &lt;3</p>
      {% endif %}
      <a class="refresh" href="/dashboard">Refresh</a>
    </div>
  </body>
</html>
"""

@app.route("/members")
def members():
    return {"members": "Members1, Members2, Members3"}

@app.route("/respond", methods=["POST"])
def respond():
    data = request.get_json(force=True)
    response_text = data.get("response", "")
    if not response_text:
        return jsonify({"error": "Empty response"}), 400
    responses.append({
        "text": response_text,
        "checklist": data.get("checklist", []),
    })
    return jsonify({"status": "ok", "message": "Response received"}), 201

@app.route("/dashboard")
def dashboard():
    return render_template_string(DASHBOARD_TEMPLATE, responses=responses[::-1])

if __name__ == "__main__":
    app.run(debug=True)