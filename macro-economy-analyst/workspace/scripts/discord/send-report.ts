import 'dotenv/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';

const REPORT_DIR = '/home/node/.openclaw/shared/report';

export async function sendReportToDiscord(): Promise<void> {
  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_CHANNEL_ID;

  if (!token || !channelId) {
    console.warn('Missing DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ID — skipping Discord send.');
    return;
  }

  if (!fs.existsSync(REPORT_DIR)) {
    console.warn(`Report directory not found: ${REPORT_DIR} — skipping Discord send.`);
    return;
  }

  const pdfFiles = fs
    .readdirSync(REPORT_DIR)
    .filter((f) => f.endsWith('.pdf'))
    .sort()
    .reverse();

  if (pdfFiles.length === 0) {
    console.warn('No PDF reports found — skipping Discord send.');
    return;
  }

  const latestFile = pdfFiles[0];
  const filePath = path.join(REPORT_DIR, latestFile);
  const stats = fs.statSync(filePath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`Sending to Discord: ${latestFile} (${fileSizeMB}MB)`);

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), {
    filename: latestFile,
    contentType: 'application/pdf',
  });

  form.append(
    'payload_json',
    JSON.stringify({
      content: `📄 **Macro Economy Report**\n\`${latestFile}\`\n${fileSizeMB}MB — ${new Date().toISOString()}`,
    }),
  );

  try {
    await axios.post(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      form,
      {
        headers: {
          Authorization: `Bot ${token}`,
          ...form.getHeaders(),
        },
      },
    );
    console.log('Report sent to Discord successfully.');
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.warn(
        'Discord API error:',
        err.response?.status,
        JSON.stringify(err.response?.data),
      );
    } else {
      console.warn('Failed to send report to Discord:', err.message);
    }
  }
}

sendReportToDiscord();
