import DetalhePartida from '@/templates/Match/Form/page';

export default function Partida({ params }: { params: { value: string } }) {
    return <DetalhePartida params={params} />;
}
