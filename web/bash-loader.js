// also define the "web" builtin helper function
globalThis.__bash_web_internal = (argv) => {
    const [cmd, ...args] = argv;

    switch (cmd) {
        case 'dom.write': {
            const selector = args[0];
            const text = args[1];

            const el = document.querySelector(selector);
            if (!el) {
                return 1;
            }

            el.textContent = text;

            return 0;
        }
        case 'document.title': {
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

async function runBashScript(src) {
        var module = await createBashModule({
                noInitialRun: true,
        });

        const text = src + '\n';
        module.FS.writeFile('/script', text);
        module.callMain(['/script']);
}

// find all bash scripts in this file
const scripts = document.querySelectorAll('script[type="text/bash"]');

for (const script of scripts) {
        await runBashScript(script.textContent);
}
