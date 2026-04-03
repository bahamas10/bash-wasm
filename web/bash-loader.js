// also define the "web" builtin helper function
function webBuiltin(argv) {
    const [cmd, ...args] = argv;

    switch (cmd) {
        case 'dom.write': {
            // usage: web dom.write '#selector' "text"
            const selector = args[0];
            const text = args[1];

            const el = document.querySelector(selector);
            if (!el) {
                return 1;
            }

            el.textContent = text;

            return 0;
        }
        case 'dom.appendHTML': {
            // usage: web dom.appendHTML '#selector' "text"
            const selector = args[0];
            const html = args[1];

            const el = document.querySelector(selector);
            if (!el) {
                return 1;
            }

            el.innerHTML += html;

            return 0;
        }
        case 'document.title': {
            // usage: web document.title "my new title"
            const text = args[0];

            document.title = text;

            return 0;
        }
        default: {
            console.error('unknown command');
            return 1;
        }
    }
};

async function runBashScript(src, stdout, stderr) {
    var opts = {
        noInitialRun: true,
    };

    // overwrite "stdout" if set
    if (stdout) {
        var el = document.querySelector(stdout);
        if (!el) {
            throw `stdout selector ${stdout} does not exist`;
        }
        opts.print = function (txt) {
            el.textContent += txt + '\n';
        };
    }

    // overwrite "stderr" if set
    if (stderr) {
        var el = document.querySelector(stderr);
        if (!el) {
            throw `stdout selector ${stderr} does not exist`;
        }
        opts.printErr = function (txt) {
            el.textContent += txt + '\n';
        };
    }

    var module = await createBashModule(opts);
    const text = src + '\n';
    module.FS.writeFile('/script', text);
    module.callMain(['/script']);
}

// TODO: dave says is there a better way to do this lol
globalThis.__bash_web_internal = webBuiltin;
globalThis.runBashScript = runBashScript;

// find all bash scripts in this file
const scripts = document.querySelectorAll('script[type="text/bash"]');

for (const script of scripts) {
    var stdout = script.dataset.stdout;
    var stderr = script.dataset.stderr;
    await runBashScript(script.textContent, stdout, stderr);
}

