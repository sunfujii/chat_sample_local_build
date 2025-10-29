const GEMINI_API_KEY = "XXXXXXXXXXX";
const GEMINI_API_URL_BASE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

function doGet(e) {
  // ブラウザからのアクセス用に固定のプロンプトを設定
  const defaultPrompt = "テスト";
  try {
    // APIを呼び出す関数を実行
    const geminiResponseText = callGeminiApi(defaultPrompt);
    
    // 成功応答テキストの前にヘッダーを追加して、ブラウザで見やすくする
    const header = "Gemini API 動作確認 (GETリクエスト成功):\n\n";
    
    Logger.log("Gemini APIからの応答を返却します。");
    
    // 応答テキストのみをクライアントに返却
    return createTextResponse(header + geminiResponseText, 200);

  } catch (error) {
    Logger.log("GET処理中にエラーが発生しました: " + error.message);
    
    // エラー情報をクライアントに返却
    return createTextResponse(
      "Gemini API 動作確認 (GETリクエスト失敗):\n\n" + 
      "GASのログを確認してください。APIキーや実行権限の問題が考えられます。\n\n" + 
      "エラー詳細: " + error.message, 
      500
    );
  }
}

function doPost(e) {
  let userInput;
  
  try {

    //TODO:GASのCORS対策のため一時対応
    //// リクエストボディをJSONとしてパース
    //const json = JSON.parse(e.postData.contents);
    //userInput = json.prompt;
    const bodyText = e.postData.contents;
    const json = JSON.parse(bodyText);
    const userInput = json.prompt || "";
    
    if (!userInput) {
      console.log("エラー: 'prompt' フィールドがリクエストボディにありません。");
      return createTextResponse("Error: 'prompt' field is missing.", 400);
    }
    
    console.log("受信したプロンプト: " + userInput);

    // APIを呼び出す関数を実行
    const geminiResponseText = callGeminiApi(userInput);
    
    console.log("Gemini APIからの応答を返却します。");
    // Geminiからの応答テキストのみをクライアントに返却
    return createTextResponse(geminiResponseText, 200);

  } catch (error) {
    console.log("処理中に予期せぬエラーが発生しました: " + error.toString());
    // 予期せぬスクリプトエラー
    return createTextResponse("An unexpected error occurred: " + error.toString(), 500);
  }
}

function callGeminiApi(prompt) {
  console.log("--- callGeminiApi 関数開始 ---");
  const url = GEMINI_API_URL_BASE + GEMINI_API_KEY;
  
  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  console.log("API URL: " + url.substring(0, 70) + "..."); // APIキーを隠してログ出力
  
  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();
  
  console.log("API応答コード: " + responseCode);

  if (responseCode !== 200) {
    console.log("API応答エラー: " + responseText);
    throw new Error("Gemini API call failed with status code " + responseCode + ". Response: " + responseText);
  }

  try {
    const geminiResponse = JSON.parse(responseText);
    const generatedText = geminiResponse.candidates[0].content.parts[0].text;
    console.log("生成されたテキスト（一部）: " + generatedText.substring(0, 50) + "...");
    return generatedText;
  } catch (e) {
    console.log("API応答のパースエラー: " + e.toString());
    throw new Error("Failed to parse Gemini API response: " + responseText);
  }
}

function createTextResponse(text, code) {
  const output = ContentService.createTextOutput(text);
  output.setMimeType(ContentService.MimeType.TEXT); 
  console.log("クライアントへステータス " + code + " で応答を返却。");
  return output;
}

function test_callGeminiApi(){
  const geminiResponseText = callGeminiApi('てすと');
}

function testDoPost() {
  const postBody = {
    prompt: "テストです"
  };
  const postBodyJson = JSON.stringify(postBody);
  const simulatedEvent = {
    postData: {
      contents: postBodyJson,
      type: 'application/json' // Content-Typeをシミュレート
    }
  };

  try {
    const result = doPost(simulatedEvent);
    Logger.log("返されたオブジェクトのMIMEタイプ: " + result.getMimeType());
    Logger.log("返されたコンテンツ:\n" + result.getContent()); 
  } catch (error) {
    Logger.log("エラー: " + error.message);
  }
}
