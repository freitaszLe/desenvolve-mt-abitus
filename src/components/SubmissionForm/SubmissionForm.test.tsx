import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SubmissionForm from './index';

global.URL.createObjectURL = vi.fn(() => 'mock-url-para-imagem.png');

describe('SubmissionForm Component', () => {
  it('should validate inputs, allow submission, and call onSave with correct data', async () => {
    // 1. Arrange
    const handleSaveMock = vi.fn();
    const handleCloseMock = vi.fn();

    render(
      <SubmissionForm 
        personName="João da Silva"
        onClose={handleCloseMock}
        onSave={handleSaveMock}
      />
    );

    // 2. Act: Simula o usuário preenchendo o formulário

    // Digita nas observações
    const obsInput = screen.getByLabelText('Observações');
    await fireEvent.change(obsInput, { target: { value: 'Visto perto do shopping 3 americas.' } });

    // Digita a data
    const dateInput = screen.getByLabelText('Data em que foi visto(a)');
    await fireEvent.change(dateInput, { target: { value: '01092025' } }); // A máscara vai formatar para 01/09/2025

    // Digita a localização
    const locationInput = screen.getByLabelText('Localização avistada');
    await fireEvent.change(locationInput, { target: { value: 'Cuiabá, MT' } });

    // Simula o upload de um arquivo
    const fileInput = screen.getByLabelText('Anexar foto (opcional)');
    const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });
    await fireEvent.change(fileInput, { target: { files: [fakeFile] } });

    // 3. Assert (antes do submit): Verificamos se a prévia da imagem apareceu
    // Usamos waitFor para esperar a atualização do estado da imagem
    await waitFor(() => {
        expect(screen.getByAltText('Prévia')).toBeInTheDocument();
    });

    // 4. Act (continuação): Clica no botão de enviar
    const submitButton = screen.getByText('Enviar');
    fireEvent.click(submitButton);

    // 5. Assert (depois do submit): Verificamos o resultado final
    // Usamos waitFor para esperar a chamada assíncrona da função de submit
    await waitFor(() => {
      // A função onSave foi chamada com os dados corretos?
      expect(handleSaveMock).toHaveBeenCalledWith(
        expect.objectContaining({
          observacoes: 'Visto perto do shopping 3 americas.',
          dataAvistamento: '01/09/2025',
          localizacao: 'Cuiabá, MT',
          fotoUrl: 'mock-url-para-imagem.png',
        })
      );

      // A função de fechar o modal foi chamada?
      expect(handleCloseMock).toHaveBeenCalledTimes(1);
    });
  });
});