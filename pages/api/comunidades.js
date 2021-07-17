import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response){

    if( request.method === 'POST') {
        const TOKEN = 'b20f27f851f90020fef68f948a2054';
        const client = new SiteClient(TOKEN);
    
        const registroCriado = client.items.create({
            itemType: '968410',
            ...request.body
        });
    
        response.json({
            registroCriado: registroCriado
        });

        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}