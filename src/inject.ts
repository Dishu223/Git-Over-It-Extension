// --- FETCH INTERCEPTOR ---
const originalFetch = window.fetch;
let lastSubmittedCode = '';
let lastSubmittedLanguage = '';

// Helper to parse bodies
const extractCodeFromBody = (bodyStr: string) => {
    try {
        if (!bodyStr) return;
        const parsed = JSON.parse(bodyStr);
        // Old API
        if (parsed.typed_code) lastSubmittedCode = parsed.typed_code;
        if (parsed.lang) lastSubmittedLanguage = parsed.lang;
        // New GraphQL API
        if (parsed.variables && parsed.variables.typedCode) {
            lastSubmittedCode = parsed.variables.typedCode;
            lastSubmittedLanguage = parsed.variables.lang;
        }
    } catch(e) {}
};

window.fetch = async function(...args) {
  const url = typeof args[0] === 'string' ? args[0] : (args[0] as any).url;
  const options = args[1] as any;

  // Capture the code when they click Submit
  if (url && (url.includes('/submit/') || url.includes('/problems/') || url.includes('/graphql'))) {
    if (options && options.body) {
        extractCodeFromBody(typeof options.body === 'string' ? options.body : '');
    }
  }

  const response = await originalFetch.apply(this, args);

  if (url && (url.includes('/submissions/detail/') || url.includes('/submit/') || url.includes('/check/'))) {
    const clone = response.clone();
    clone.json().then(data => {
      // Check for ACCEPTED in both Old API and New GraphQL API responses
      if (data.status_code === 10 || data.state === 'SUCCESS' || data.status_msg === 'Accepted' || (data.data && data.data.submissionDetails && data.data.submissionDetails.statusCode === 10)) {
        data.code = data.code || lastSubmittedCode;
        data.lang = data.lang || lastSubmittedLanguage;
        console.log("Git Over It: Caught via Fetch!", data);
        window.postMessage({ type: 'LEETCODE_SUBMISSION', payload: data }, '*');
      }
    }).catch(() => {});
  }
  return response;
};

// --- XHR INTERCEPTOR ---
const originalXHR = window.XMLHttpRequest;
const originalXHRSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.send = function(body) {
    if (typeof body === 'string') {
        extractCodeFromBody(body);
    }
    return originalXHRSend.apply(this, arguments as any);
};

function newXHR() {
    const xhr = new originalXHR();
    xhr.addEventListener('load', function() {
        const url = xhr.responseURL;
        if (url && (url.includes('/submissions/detail/') || url.includes('/submit/') || url.includes('/check/'))) {
            try {
                const data = JSON.parse(xhr.responseText);
                if (data.status_code === 10 || data.state === 'SUCCESS' || data.status_msg === 'Accepted') {
                    data.code = data.code || lastSubmittedCode;
                    data.lang = data.lang || lastSubmittedLanguage;
                    console.log("Git Over It: Caught via XHR!", data);
                    window.postMessage({ type: 'LEETCODE_SUBMISSION', payload: data }, '*');
                }
            } catch (e) {}
        }
    });
    return xhr;
}
(window as any).XMLHttpRequest = newXHR;

console.log("Git Over It: Interceptors Injected successfully via src!");
