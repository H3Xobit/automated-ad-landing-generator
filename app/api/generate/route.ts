import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: GROQ_API_KEY is not set' },
        { status: 500 }
      );
    }

    let body: { adUrl?: string; landingUrl?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { adUrl, landingUrl } = body;

    if (!adUrl || !landingUrl) {
      return NextResponse.json(
        { error: 'Both ad URL and landing page URL are required' },
        { status: 400 }
      );
    }

    try {
      new URL(adUrl);
      new URL(landingUrl);
    } catch {
      return NextResponse.json(
        { error: 'Please enter valid URLs (including https://)' },
        { status: 400 }
      );
    }

    // Step 1: Analyze the ad creative
    const adAnalysisPrompt = `You are analyzing an advertisement to understand its key elements.

Ad URL: ${adUrl}

Based on this ad, identify:
1. Main headline or key message
2. Tone and voice (professional, casual, urgent, friendly, etc.)
3. Target audience
4. Primary call-to-action
5. Key value propositions
6. Color scheme or visual style (if image/video)

Provide a concise analysis in 3-4 sentences that captures the essence of this ad.`;

    const adAnalysis = await groq.chat.completions.create({
      messages: [{ role: 'user', content: adAnalysisPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
    });

    const adInsights = adAnalysis.choices[0]?.message?.content || '';

    // Step 2: Generate personalized landing page
    const generatePagePrompt = `You are a landing page designer creating a personalized landing page.

ORIGINAL LANDING PAGE: ${landingUrl}

AD CREATIVE ANALYSIS:
${adInsights}

YOUR TASK:
Create a complete, professional HTML landing page that matches the ad creative's messaging, tone, and style.

REQUIREMENTS:
- Match the tone and voice from the ad
- Use similar messaging and value propositions
- Maintain brand consistency
- Include a clear call-to-action matching the ad
- Make it responsive and mobile-friendly
- Use modern, clean design
- Include proper meta tags

IMPORTANT RULES:
1. Return ONLY the complete HTML code (starting with <!DOCTYPE html>)
2. Do NOT include any markdown code blocks or backticks
3. Do NOT include any explanations or comments outside the HTML
4. Make the page fully self-contained (inline CSS, no external dependencies)
5. Ensure all styling is professional and matches the ad's aesthetic

Generate the HTML now:`;

    const pageGeneration = await groq.chat.completions.create({
      messages: [{ role: 'user', content: generatePagePrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
    });

    let htmlContent = pageGeneration.choices[0]?.message?.content || '';

    // Clean up the HTML (remove markdown code blocks if present)
    htmlContent = htmlContent.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    // Ensure it starts with DOCTYPE
    if (!htmlContent.toLowerCase().startsWith('<!doctype')) {
      htmlContent = '<!DOCTYPE html>\n' + htmlContent;
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `landing-${timestamp}.html`;

    // In a real implementation, you would:
    // 1. Save this HTML to a file storage service (S3, Vercel Blob, etc.)
    // 2. Return the public URL
    
    // For this demo, we'll return the HTML as a data URL
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;

    return NextResponse.json({
      success: true,
      pageUrl: dataUrl,
      filename: filename,
      message: 'Landing page generated successfully',
    });

  } catch (error: any) {
    console.error('Error generating landing page:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate landing page' },
      { status: 500 }
    );
  }
}