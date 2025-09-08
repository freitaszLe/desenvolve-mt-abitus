import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Card from './index';
import { type Pessoa } from '../../services/api';

// O MemoryRouter é necessário porque nosso Card contém um componente <Link>
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('Card Component', () => {
  it('should render person\'s name, age, and status correctly', () => {
    // 1. Arrange: Criamos um "dublê" da pessoa
    const mockPessoa: Pessoa = {
      id: 1,
      nome: 'Leticia Freitas',
      idade: 25,
      sexo: 'FEMININO',
      urlFoto: 'url-da-foto.png',
      ultimaOcorrencia: {
        status: 'LOCALIZADO',
        dataLocalizacao: '2025-01-01',
        encontradoVivo: true,
        dtDesaparecimento: '2024-01-01',
      },
    };

    // 2. Act: Renderizamos o componente com os dados do dublê
    renderWithRouter(<Card pessoa={mockPessoa} />);

    // 3. Assert: Verificamos se as informações aparecem na "tela"
    expect(screen.getByText('Leticia Freitas')).toBeInTheDocument();
    expect(screen.getByText('Idade: 25 anos')).toBeInTheDocument();
    expect(screen.getByText('Localizado')).toBeInTheDocument();
  });
});