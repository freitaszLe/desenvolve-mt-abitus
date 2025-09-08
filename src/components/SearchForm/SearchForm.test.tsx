import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchForm from './index';

describe('SearchForm Component', () => {
  it('should call onSearch with the correct filter data when submitted', () => {
    // 1. Arrange: Preparamos o cenário
    const handleSearchMock = vi.fn(); // Cria uma "função espiã" para observar se ela é chamada

    render(<SearchForm onSearch={handleSearchMock} />);

    // 2. Act: Simulamos as ações do usuário

    // Encontra o campo de nome pelo seu 'label' e simula a digitação
    const nameInput = screen.getByLabelText('Nome');
    fireEvent.change(nameInput, { target: { value: 'Maria' } });

    // Encontra o campo de status pelo seu 'label' e simula a seleção
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'LOCALIZADO' } });

    // Encontra o botão de busca pelo seu texto e simula o clique
    const submitButton = screen.getByText('Buscar');
    fireEvent.click(submitButton);

    // 3. Assert: Verificamos se o resultado foi o esperado

    // A função espiã foi chamada uma vez?
    expect(handleSearchMock).toHaveBeenCalledTimes(1);

    // A função foi chamada com os dados corretos que digitamos?
    expect(handleSearchMock).toHaveBeenCalledWith({
      nome: 'Maria',
      status: 'LOCALIZADO'
    });
  });
});