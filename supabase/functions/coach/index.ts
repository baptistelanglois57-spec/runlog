import { buildSystemPrompt } from "./prompt.ts";
import { prepareContext } from "./tools.ts";


console.log("Coach Function Ready");

Deno.serve(async (req: Request) => {
  try {
    const { question, context } =
      await req.json();

    const systemPrompt =
      buildSystemPrompt();

    const contextText =
      prepareContext(context);

    return Response.json({
      success: true,

      systemPrompt,

      context: contextText,

      question,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
});