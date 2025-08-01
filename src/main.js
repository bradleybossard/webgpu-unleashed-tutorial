import './style.css'

async function webgpu() {
    if (!navigator.gpu) {
        console.error("WebGPU is not available.");
        return;
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        console.error("Failed to request Adapter.");
        return;
    }

    let device = await adapter.requestDevice();
    if (!device) {
        console.error("Failed to request Device.");
        return;
    }

    const context = canvas.getContext('webgpu');
    
    const canvasConfig = {
        device: device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        usage:
            GPUTextureUsage.RENDER_ATTACHMENT,
        alphaMode: 'opaque'
    };
    
    context.configure(canvasConfig);

    let colorTexture = context.getCurrentTexture();
    let colorTextureView = colorTexture.createView();

    let colorAttachment = {
        view: colorTextureView,
        clearValue: { r: 1, g: 0, b: 0, a: 1 },
        loadOp: 'clear',
        storeOp: 'store'
    };

    const renderPassDesc = {
        colorAttachments: [colorAttachment]
    };
    let commandEncoder = device.createCommandEncoder();

    let passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
    passEncoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
}
webgpu();