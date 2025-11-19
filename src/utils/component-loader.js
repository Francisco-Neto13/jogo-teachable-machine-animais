/**
 * @param {string} componentUrl 
 * @param {string} targetId 
 */
export async function loadComponent(componentUrl, targetId) {
    try {
        const response = await fetch(componentUrl);
        if (!response.ok) {
            throw new Error(`Erro ao carregar componente: ${response.statusText}`);
        }
        const html = await response.text();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.innerHTML = html;
        } else {
            console.error(`Elemento de destino com ID "${targetId}" não encontrado.`);
        }
    } catch (error) {
        console.error(`Falha ao carregar ${componentUrl}:`, error);
    }
}