import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [config, setConfig] = useState({
        openai_key: '',
        training_data: '',
        evolution_api_url: '',
        evolution_api_key: '',
        evolution_instance_name: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const resp = await axios.get('http://localhost:3001/api/config');
            setConfig(resp.data || {});
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post('http://localhost:3001/api/config', config);
            setMessage('Configurações salvas com sucesso!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Erro ao salvar configurações.');
        }
    };

    if (loading) return <div className="container">Carregando...</div>;

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingTop: '20px' }}>
                <h1>Painel de Controle IA</h1>
                <button className="btn btn-primary" onClick={handleSave}>Salvar Tudo</button>
            </header>

            {message && <div className="glass" style={{ padding: '10px 20px', marginBottom: '20px', backgroundColor: 'var(--accent)', color: 'white' }}>{message}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* AI Config */}
                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Configuração da IA</h3>
                    <div className="input-group">
                        <label>API KEY do OpenAI</label>
                        <input
                            type="password"
                            value={config.openai_key || ''}
                            onChange={(e) => setConfig({ ...config, openai_key: e.target.value })}
                            placeholder="sk-..."
                        />
                    </div>
                    <div className="input-group">
                        <label>Treinamento da IA (Conhecimento)</label>
                        <textarea
                            rows="10"
                            value={config.training_data || ''}
                            onChange={(e) => setConfig({ ...config, training_data: e.target.value })}
                            placeholder="Cole aqui as instruções e informações que a IA deve saber..."
                        />
                    </div>
                </div>

                {/* WhatsApp Config */}
                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Conexão WhatsApp (Evolution API)</h3>
                    <div className="input-group">
                        <label>URL da Evolution API</label>
                        <input
                            type="text"
                            value={config.evolution_api_url || ''}
                            onChange={(e) => setConfig({ ...config, evolution_api_url: e.target.value })}
                            placeholder="https://sua-instancia.com"
                        />
                    </div>
                    <div className="input-group">
                        <label>API KEY (apikey)</label>
                        <input
                            type="password"
                            value={config.evolution_api_key || ''}
                            onChange={(e) => setConfig({ ...config, evolution_api_key: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label>Nome da Instância</label>
                        <input
                            type="text"
                            value={config.evolution_instance_name || ''}
                            onChange={(e) => setConfig({ ...config, evolution_instance_name: e.target.value })}
                            placeholder="ex: atendente-01"
                        />
                    </div>

                    <div style={{ marginTop: '30px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                        <h4>Status da Conexão</h4>
                        <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginTop: '10px' }}>
                            <p style={{ color: 'var(--text-dim)' }}>Configure a API para gerar o QR Code.</p>
                            {/* Espaço para o QR Code futuro */}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Dashboard;
