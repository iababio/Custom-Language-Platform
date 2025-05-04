import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
   const telemetryProperties: Record<string, unknown> = {};
   const requestStartTime = Date.now();

   try {
      const { userId } = await auth();
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      telemetryProperties.userId = userId;

      const { messages, language = 'english', sessionId } = await request.json();

      telemetryProperties.language = language;
      telemetryProperties.sessionId = sessionId;
      telemetryProperties.messageCount = messages?.length || 0;

      if (!messages || !Array.isArray(messages)) {
         return NextResponse.json(
            { error: 'Invalid request: messages array is required' },
            { status: 400 },
         );
      }

      let systemMessage = {};

      switch (language) {
         case 'french':
            systemMessage = {
               role: 'system',
               content:
                  "Vous êtes un assistant IA utile. Répondez en français à toutes les questions de l'utilisateur. Soyez concis et précis dans vos réponses.",
            };
            break;
         case 'swahili':
            systemMessage = {
               role: 'system',
               content:
                  'Wewe ni msaidizi wa AI unayesaidia. Jibu maswali ya mtumiaji kwa lugha ya Kiswahili. Kuwa mfupi na sahihi katika majibu yako.',
            };
            break;
         case 'english':
         default:
            systemMessage = {
               role: 'system',
               content:
                  "You are a helpful AI assistant. Answer the user's questions in English. Be concise and accurate in your responses.",
            };
            break;
      }

      const formattedMessages = [systemMessage, ...messages];

      if (request.headers.get('accept') === 'text/event-stream') {
         try {
            const stream = await client.chat.completions.create({
               model: process.env.OPENAI_MODEL || 'gpt-4o',
               messages: formattedMessages,
               stream: true,
               temperature: 0.7,
               max_tokens: 800,
               top_p: 0.95,
               frequency_penalty: 0,
               presence_penalty: 0,
               user: userId,
            });

            return new Response(
               new ReadableStream({
                  async start(controller) {
                     const encoder = new TextEncoder();

                     let fullContent = '';
                     let lastPing = Date.now();
                     const KEEP_ALIVE_INTERVAL = 15000;
                     try {
                        for await (const chunk of stream) {
                           const content = chunk.choices[0]?.delta?.content || '';

                           if (content) {
                              fullContent += content;

                              controller.enqueue(
                                 encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
                              );

                              lastPing = Date.now();
                           }

                           if (Date.now() - lastPing > KEEP_ALIVE_INTERVAL) {
                              controller.enqueue(encoder.encode(`: keep-alive\n\n`));
                              lastPing = Date.now();
                           }
                        }

                        telemetryProperties.responseLength = fullContent.length;
                        telemetryProperties.responseDuration = Date.now() - requestStartTime;

                        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                        controller.close();

                        console.log(
                           `Stream completed: ${telemetryProperties.sessionId}, length: ${fullContent.length}`,
                        );
                     } catch (error) {
                        console.error('Error in stream processing:', error);

                        try {
                           controller.enqueue(
                              encoder.encode(
                                 `data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`,
                              ),
                           );
                           controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                        } catch {
                           // Silent catch - we're already in error state
                        }

                        controller.error(error);
                     }
                  },
               }),
               {
                  headers: {
                     'Content-Type': 'text/event-stream',
                     'Cache-Control': 'no-cache, no-transform',
                     Connection: 'keep-alive',
                     'X-Accel-Buffering': 'no',
                  },
               },
            );
         } catch (streamError) {
            console.error('Failed to initialize stream:', streamError);
            return NextResponse.json({ error: 'Failed to initialize stream' }, { status: 500 });
         }
      } else {
         const response = await client.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o',
            messages: formattedMessages,
            stream: false, // Fix: This was incorrectly set to true
            temperature: 0.7,
            max_tokens: 800,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
            user: userId,
         });

         const responseMessage =
            response.choices[0]?.message?.content || "I don't have an answer for that.";

         if (response.usage) {
            telemetryProperties.promptTokens = response.usage.prompt_tokens;
            telemetryProperties.completionTokens = response.usage.completion_tokens;
            telemetryProperties.totalTokens = response.usage.total_tokens;
            telemetryProperties.responseDuration = Date.now() - requestStartTime;
         }

         return NextResponse.json({ message: responseMessage });
      }
   } catch (error) {
      console.error('Error processing chat request:', error);

      telemetryProperties.error = error instanceof Error ? error.message : String(error);
      telemetryProperties.errorStack = error instanceof Error ? error.stack : undefined;
      telemetryProperties.responseDuration = Date.now() - requestStartTime;

      return NextResponse.json(
         {
            error: 'Failed to process request',
            details: error instanceof Error ? error.message : String(error),
         },
         { status: 500 },
      );
   } finally {
      // Optional: log telemetry properties at the end of each request
      // This would typically call Azure Monitor or Application Insights
      // logTelemetry('ChatCompletion', telemetryProperties);
   }
}
