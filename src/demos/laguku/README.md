# Laguku

This demo embeds the live **laguku.co** website inside the portfolio shell.
The iframe loads the production site at full height; portfolio chrome (top
bar, brand tile) wraps it. No sub-screens, no fixtures, no re-implementation
— the live site is the demo. Refresh / interaction state belongs to
laguku.co, not to this wrapper.

If laguku.co sets `X-Frame-Options: DENY` in the future, replace the iframe
with an "External site refuses embed" message and a link to open it
directly.
