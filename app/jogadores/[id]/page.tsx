import FormJogador from '@/templates/Players/Form/page';

export default function NovoJogador({ params }: { params: { value: string } }) {
    return <FormJogador params={params} />;
}
